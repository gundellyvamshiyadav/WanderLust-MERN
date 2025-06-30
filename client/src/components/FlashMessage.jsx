import React from "react";
import { useNotification } from "../context/NotificationContext";

const FlashMessage = () => {
  const { notification, clearNotification } = useNotification();

  if (!notification) {
    return null;
  }

  const alertTypeClass =
    notification.type === "error" ? "alert-danger" : "alert-success";

  return (
    <div className="row">
      <div
        className={`alert ${alertTypeClass} alert-dismissible fade show col-6 offset-3`}
        role="alert"
      >
        {notification.message}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={clearNotification}
        ></button>
      </div>
    </div>
  );
};

export default FlashMessage;
