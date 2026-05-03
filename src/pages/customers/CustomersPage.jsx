import { useCustomers } from './data/dataLayer';
import CustomerTable from './components/CustomerTable';
import ExportCSV from '../../shared/ExportCSV';
import { formatDate } from '../../utils/formatters';

const CUSTOMER_CSV_COLUMNS = [
  { label: 'Name', accessor: (c) => c.name },
  { label: 'Phone', accessor: (c) => c.phone },
  { label: 'Orders', accessor: (c) => c.orderCount },
  { label: 'Total Spent', accessor: (c) => c.totalSpent || 0 },
  { label: 'Last Order', accessor: (c) => c.lastOrderDate ? formatDate(c.lastOrderDate) : '' },
];

export default function CustomersPage() {
  const { customers, loading } = useCustomers();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash mb-2">[ people ]</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">Customers</h2>
          <p className="text-sm text-warmblack/30 mt-1">{loading ? '...' : `${customers.length} customers`}</p>
        </div>
        <ExportCSV data={customers} columns={CUSTOMER_CSV_COLUMNS} filename="customers.csv" />
      </div>
      <CustomerTable customers={customers} />
    </div>
  );
}
