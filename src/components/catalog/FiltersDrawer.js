import React from "react";
import Modal from "../../ui/Modal";
import FiltersPanel from "./FiltersPanel";

export default function FiltersDrawer({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Фильтры"
      description="Выберите, что точно нужно, а что лучше исключить"
      footer={
        <button
          type="button"
          className="w-full rounded-full border px-4 py-2 text-sm transition hover:bg-white/[0.06]"
          style={{ borderColor: "rgba(247,242,232,0.12)", color: "#F7F2E8" }}
          onClick={onClose}
        >
          Закрыть
        </button>
      }
    >
      <FiltersPanel onClose={onClose} />
    </Modal>
  );
}
