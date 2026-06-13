import { TableActions } from '../../shared-modals/ButtonAction';
import {STATUS_BADGE_CLASS} from'../invoice.constants';
import {renderTag} from'../../faq/_components/TableCell';




const currencyFormat = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const dateFormat = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const tableRenderers = ({
  handleEditInvoice,
  handleDeleteInvoice,
  openDetailModal,
  handlePrintInvoice,
  handleConfirmPayment,
}) => {
  return (item, key)=>{  
  switch (key) {
      case 'kode_invoice':
        return item.kode_invoice;
      case 'tanggal':
        return (
          <div>
            <div className="font-medium text-slate-900">{dateFormat(item.tanggal_invoice)}</div>
            <div className="text-xs text-slate-500">Due: {dateFormat(item.jatuh_tempo)}</div>
          </div>
        );
      case 'pemilik':
        return (
          <div>
            <div className="font-medium text-slate-900">{item.pasien?.username || item.pasien?.name || '-'}</div>
            <div className="text-xs text-slate-500">{item.hewan?.nama_hewan || item.hewan?.petName || '-'}</div>
          </div>
        );
      case 'items':
        return `${item.details_count ?? item.details?.length ?? 0} item`;
      case 'total':
        return (
          <div>
            <div className="font-medium text-slate-900">{currencyFormat(item.total)}</div>
            {Number(item.diskon_persen || 0) > 0 ? <div className="text-xs text-rose-500">Diskon {Number(item.diskon_persen)}%</div> : null}
          </div>
        );
      case 'status':
        return renderTag(item.status, STATUS_BADGE_CLASS);
      case 'actions':
        return (
          <TableActions
            item={item}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onDetail={openDetailModal}
            onPrint={handlePrintInvoice}
            extraActions={
              String(item.status || '').toLowerCase() !== 'lunas' ? (
                <button
                  type="button"
                  onClick={() => handleConfirmPayment(item)}
                  className="inline-flex h-8 items-center rounded-lg bg-accent-green-400 px-4 text-xs font-semibold text-white transition hover:bg-accent-green-500"
                >
                  Bayar
                </button>
              ) : null
            }
          />
        );
      default:
        return item[key] || '-';
    }
  }
};