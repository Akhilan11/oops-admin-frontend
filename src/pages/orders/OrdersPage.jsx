import { useOrders } from './data/dataLayer';
import OrderTable from './components/OrderTable';
import ExportCSV from '../../shared/ExportCSV';
import { formatDate } from '../../utils/formatters';

const ORDER_CSV_COLUMNS = [
  { label: 'Order ID', accessor: (o) => o.id },
  { label: 'Date', accessor: (o) => formatDate(o.date) },
  { label: 'Customer', accessor: (o) => o.shipping?.fullName || '' },
  { label: 'Phone', accessor: (o) => o.shipping?.phone || '' },
  { label: 'City', accessor: (o) => o.shipping?.city || '' },
  { label: 'State', accessor: (o) => o.shipping?.state || '' },
  { label: 'Items', accessor: (o) => o.items?.map((i) => `${i.name} (${i.size} x${i.qty})`).join('; ') },
  { label: 'Total', accessor: (o) => o.total || 0 },
  { label: 'Payment', accessor: (o) => o.paymentMethod === 'prepaid' ? 'Online' : 'COD' },
  { label: 'Status', accessor: (o) => o.status },
];

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash mb-2">[ fulfillment ]</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">Orders</h2>
          <p className="text-sm text-warmblack/30 mt-1">{orders.length} total orders</p>
        </div>
        <ExportCSV data={orders} columns={ORDER_CSV_COLUMNS} filename="orders.csv" />
      </div>
      <OrderTable orders={orders} />
    </div>
  );
}
