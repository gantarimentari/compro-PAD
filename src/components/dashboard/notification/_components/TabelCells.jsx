
import { NOTIFICATION_TYPE_BADGE_CLASS, NOTIFICATION_STATUS_BADGE_CLASS } from "../notif.constants";
import { ButtonAction } from "./ButtonAction";

const renderTag = (label, configMap) => {
  const config = configMap[label] || {};
  return (
    <div className={`text-center whitespace-normal max-w-xs  ${config.bg || 'bg-gray-100'} rounded-lg`}>
      <span className={`inline-flex px-4 py-2  text-body-2 rounded-lg  ${config.text || ' text-gray-700'}`}>
        {label}
      </span>
    </div>
  );
};

export const tableRenderers = (onOpenDetail, onResend) => {
  return (item, key) => {
    switch (key) {
      case 'type':
        return renderTag(item.type, NOTIFICATION_TYPE_BADGE_CLASS);
      case 'status':
        return (
          renderTag(item.status, NOTIFICATION_STATUS_BADGE_CLASS)
        );
      case 'actions': {
        return (
          <ButtonAction
            item={item}
            onOpenDetail={onOpenDetail}
            onResend={onResend}
          />
        );
      }
      default:
        return item[key] || '-';
    }
  };
};
