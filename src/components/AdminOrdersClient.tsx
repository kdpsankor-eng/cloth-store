"use client";

import React, { useState } from "react";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  Eye,
  X,
  Phone,
  MapPin,
  Calendar,
  Save,
  Loader2,
} from "lucide-react";

interface OrderItem {
  id: string;
  productNameSnapshot: string;
  variantNameSnapshot?: string | null;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryZone: string;
  orderNotes?: string | null;
  subtotal: number;
  deliveryCharge: number;
  totalPayable: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  courierName?: string | null;
  trackingCode?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: OrderRecord[];
}) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Edit State in Modal
  const [editStatus, setEditStatus] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleOpenModal = (ord: OrderRecord) => {
    setSelectedOrder(ord);
    setEditStatus(ord.orderStatus);
    setCourierName(ord.courierName || "Steadfast");
    setTrackingCode(ord.trackingCode || "");
    setAdminNotes("");
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);

    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          newStatus: editStatus,
          courierName,
          trackingCode,
          adminNotes,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? {
                  ...o,
                  orderStatus: editStatus,
                  courierName,
                  trackingCode,
                }
              : o
          )
        );

        setSelectedOrder((prev) =>
          prev ? { ...prev, orderStatus: editStatus, courierName, trackingCode } : null
        );

        setToastMessage("অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!");
        setTimeout(() => setToastMessage(""), 3000);
      } else {
        alert(data.error || "আপডেট ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      alert("সার্ভার এরর। আবার চেষ্টা করুন।");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Search Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#252525]">
            অর্ডার ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-gray-500">
            মোট {filteredOrders.length}টি অর্ডার পাওয়া গেছে
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="নাম, ফোন বা অর্ডার নং..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs text-[#252525] focus:outline-hidden focus:border-[#762A43] transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#762A43] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {st === "ALL"
                ? "সকল অর্ডার"
                : st === "PENDING"
                ? "পেন্ডিং (নতুন)"
                : st === "CONFIRMED"
                ? "কনফার্মড"
                : st === "PROCESSING"
                ? "প্যাকেজিং"
                : st === "SHIPPED"
                ? "শিপড / কুরিয়ার"
                : st === "DELIVERED"
                ? "ডেলিভার্ড"
                : "বাতিল"}
            </button>
          )
        )}
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100 font-semibold">
              <tr>
                <th className="p-4">অর্ডার নং</th>
                <th className="p-4">গ্রাহক</th>
                <th className="p-4">মোবাইল</th>
                <th className="p-4">আইটেম</th>
                <th className="p-4">মোট টাকা</th>
                <th className="p-4">কুরিয়ার</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  let badge = "bg-amber-50 text-amber-700 border-amber-200";
                  if (ord.orderStatus === "CONFIRMED")
                    badge = "bg-blue-50 text-blue-700 border-blue-200";
                  if (ord.orderStatus === "SHIPPED")
                    badge = "bg-purple-50 text-purple-700 border-purple-200";
                  if (ord.orderStatus === "DELIVERED")
                    badge = "bg-green-50 text-green-700 border-green-200";
                  if (ord.orderStatus === "CANCELLED")
                    badge = "bg-red-50 text-red-700 border-red-200";

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#762A43]">
                        {ord.orderNumber}
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        {ord.customerName}
                      </td>
                      <td className="p-4 tabular-nums text-gray-600">
                        {ord.customerPhone}
                      </td>
                      <td className="p-4 text-gray-700">
                        {ord.items.length}টি
                      </td>
                      <td className="p-4 tabular-nums font-bold text-[#252525]">
                        ৳ {ord.totalPayable.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-500">
                        {ord.courierName ? (
                          <span className="font-medium text-gray-800">
                            {ord.courierName}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge}`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenModal(ord)}
                          className="px-3 py-1.5 rounded-lg bg-[#762A43] hover:bg-[#5E2034] text-white font-semibold text-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিস্তারিত</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400 block">অর্ডার বিবরণী</span>
                <h3 className="text-lg font-bold font-mono text-[#762A43]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">গ্রাহকের তথ্য:</span>
                <p className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</p>
                <p className="tabular-nums font-semibold text-[#762A43] flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${selectedOrder.customerPhone}`} className="hover:underline">
                    {selectedOrder.customerPhone}
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 block font-semibold">ডেলিভারি ঠিকানা:</span>
                <p className="text-gray-800 leading-relaxed">{selectedOrder.deliveryAddress}</p>
                <p className="text-gray-500 font-medium">
                  এলাকা: {selectedOrder.deliveryZone === "INSIDE_DHAKA" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}
                </p>
                {selectedOrder.orderNotes && (
                  <p className="text-amber-800 bg-amber-50 p-1.5 rounded text-[11px] mt-1">
                    নোট: {selectedOrder.orderNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                অর্ডারের আইটেমসমূহ
              </h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F7F0E8]/60 text-gray-700">
                    <tr>
                      <th className="p-2.5">পোশাকের নাম</th>
                      <th className="p-2.5">সাইজ</th>
                      <th className="p-2.5 text-center">পরিমাণ</th>
                      <th className="p-2.5 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-2.5 font-medium">{it.productNameSnapshot}</td>
                        <td className="p-2.5 text-gray-500">{it.variantNameSnapshot || "Free"}</td>
                        <td className="p-2.5 text-center tabular-nums font-semibold">{it.quantity}</td>
                        <td className="p-2.5 text-right tabular-nums font-bold text-[#762A43]">
                          ৳ {it.lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right">ডেলিভারি চার্জ:</td>
                      <td className="p-2.5 text-right tabular-nums">৳ {selectedOrder.deliveryCharge}</td>
                    </tr>
                    <tr className="text-sm text-[#252525]">
                      <td colSpan={3} className="p-2.5 text-right">সর্বমোট বিল:</td>
                      <td className="p-2.5 text-right text-[#762A43] tabular-nums">৳ {selectedOrder.totalPayable.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateOrder} className="space-y-4 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-[#762A43] uppercase tracking-wider">
                স্ট্যাটাস ও কুরিয়ার পরিবর্তন করুন
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অর্ডার স্ট্যাটাস
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#252525] focus:outline-hidden focus:border-[#762A43]"
                  >
                    <option value="PENDING">PENDING (অর্ডার গৃহীত)</option>
                    <option value="CONFIRMED">CONFIRMED (কনফার্মড)</option>
                    <option value="PROCESSING">PROCESSING (প্যাকেজিং চলছে)</option>
                    <option value="SHIPPED">SHIPPED (কুরিয়ারে পাঠানো হয়েছে)</option>
                    <option value="DELIVERED">DELIVERED (ডেলিভারি সম্পন্ন)</option>
                    <option value="CANCELLED">CANCELLED (অর্ডার বাতিল)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    কুরিয়ার পার্টনার
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-xs text-[#252525] focus:outline-hidden focus:border-[#762A43]"
                  >
                    <option value="Steadfast">Steadfast Courier</option>
                    <option value="Pathao">Pathao Courier</option>
                    <option value="RedX">RedX Logistics</option>
                    <option value="eCourier">eCourier</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="Sundarban">সুন্দরবন কুরিয়ার</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  কুরিয়ার কনসাইনমেন্ট / ট্র্যাকিং আইডি
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ST-984210"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs font-mono text-[#252525] focus:outline-hidden focus:border-[#762A43]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 rounded-lg bg-[#762A43] hover:bg-[#5E2034] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>পরিবর্তন সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
