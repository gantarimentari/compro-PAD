import { FAQ_STATUS_BADGE_CLASS} from '../faq.constants';
import { ButtonAction } from './ButtonAction';

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

const renderTextWithTooltip = (text, maxLength = 50) => {
  if (!text) return '-';
  const shouldTruncate = text.length > maxLength;
  return (
    <span title={shouldTruncate ? text : ''} className="block truncate">
      {text}
    </span>
  );
};

export const tableRenderers = (onOpenEdit, onOpenDelete, onOpenDetail) => {
  return (item, key)=>{
    switch (key) {
      case 'question':
        return renderTextWithTooltip(item.question, 50);
      case 'answer':
        return renderTextWithTooltip(item.answer, 60);
      case 'status':
        return renderTag(item.status, FAQ_STATUS_BADGE_CLASS);
      case 'actions': {
        return (
          <ButtonAction
            item={item}
            onEdit={() => onOpenEdit?.(item)}
            onDelete={() => onOpenDelete?.(item.id ?? item.id_faq)}
            onOpenDetail={() => onOpenDetail?.(item)}
          />
        );
      }
      default:
        return item[key] || '-';
    }
  }
};