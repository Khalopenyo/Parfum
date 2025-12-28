import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { THEME } from "../data/theme";
import { PERFUMES } from "../data/perfumes";
import { useShopStore } from "../store/useShopStore";
import { priceForVolume } from "../lib/scoring";

export default function CartPage() {
  const { cart, removeFromCart, setQty } = useShopStore((state) => ({
    cart: state.cart,
    removeFromCart: state.removeFromCart,
    setQty: state.setQty,
  }));

  const items = useMemo(() => {
    return cart
      .map((row) => {
        const perfume = PERFUMES.find((p) => p.id === row.id);
        if (!perfume) return null;
        const unit = priceForVolume(perfume.price, row.volume, perfume.baseVolume);
        const sum = unit * row.qty;
        return { ...row, perfume, unit, sum };
      })
      .filter(Boolean);
  }, [cart]);

  const total = items.reduce((acc, x) => acc + x.sum, 0);

  return (
    <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold">Корзина</div>
            <div className="mt-1 text-sm" style={{ color: THEME.muted }}>
              Товары сохраняются в браузере (localStorage)
            </div>
          </div>

          <Link
            to="/"
            className="rounded-full border px-4 py-2 text-sm hover:bg-white/[0.06]"
            style={{ borderColor: THEME.border2, color: THEME.text }}
          >
            ← В каталог
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-3xl border p-6" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
            <div className="text-lg font-semibold">Пока пусто</div>
            <div className="mt-2 text-sm" style={{ color: THEME.muted }}>
              Добавь аромат из каталога — и он появится здесь.
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map((x) => (
                <div
                  key={x.id + "-" + x.volume}
                  className="rounded-3xl border p-4"
                  style={{ borderColor: THEME.border2, background: THEME.surface2 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="h-20 w-20 overflow-hidden rounded-2xl border"
                        style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}
                      >
                        <img src={x.perfume.image} alt={x.perfume.name} className="h-full w-full object-cover" />
                      </div>

                      <div>
                        <div className="text-xs" style={{ color: THEME.muted }}>
                          {x.perfume.brand}
                        </div>
                        <div className="mt-1 text-lg font-semibold">{x.perfume.name}</div>
                        <div className="mt-1 text-sm" style={{ color: THEME.muted }}>
                          {x.volume} мл · {x.unit}{x.perfume.currency} / шт
                        </div>
                      </div>
                    </div>

                    <button
                      className="rounded-full border px-4 py-2 text-sm hover:bg-white/[0.06]"
                      style={{ borderColor: THEME.border2, color: THEME.text }}
                      onClick={() => removeFromCart(x.id, x.volume)}
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: THEME.muted }}>
                        Кол-во:
                      </span>
                      <button
                        className="h-9 w-9 rounded-full border hover:bg-white/[0.06]"
                        style={{ borderColor: THEME.border2, color: THEME.text }}
                        onClick={() => setQty(x.id, x.volume, x.qty - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-[36px] text-center text-sm">{x.qty}</span>
                      <button
                        className="h-9 w-9 rounded-full border hover:bg-white/[0.06]"
                        style={{ borderColor: THEME.border2, color: THEME.text }}
                        onClick={() => setQty(x.id, x.volume, x.qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs" style={{ color: THEME.muted }}>
                        Сумма
                      </div>
                      <div className="text-lg font-semibold">
                        {x.sum}{x.perfume.currency}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border p-5" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
              <div className="flex items-center justify-between">
                <div className="text-sm" style={{ color: THEME.muted }}>
                  Итого
                </div>
                <div className="text-2xl font-semibold">{total}₽</div>
              </div>
              <button
                className="mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold"
                style={{ background: THEME.accent, color: "#0B0B0F" }}
                onClick={() => alert("Дальше подключим оформление заказа через мессенджер")}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
