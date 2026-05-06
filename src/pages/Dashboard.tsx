import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Navbar from '../components/Navbar';
import AddTransactionForm from '../components/AddTransactionForm';
import api from '../api/client';

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<string, number>;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery<Summary>({
    queryKey: ['summary'],
    queryFn: async () => {
      const res = await api.get('/summary');
      return res.data;
    },
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<
    Transaction[]
  >({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.get('/transactions');
      return res.data;
    },
  });

  const chartData = summary
    ? Object.entries(summary.byCategory).map(([category, amount]) => ({
        category,
        amount,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Income</p>
            <p className="text-2xl font-medium text-green-600">
              ${summaryLoading ? '...' : summary?.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <p className="text-2xl font-medium text-red-500">
              ${summaryLoading ? '...' : summary?.totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Balance</p>
            <p
              className={`text-2xl font-medium ${summary && summary.balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}
            >
              ${summaryLoading ? '...' : summary?.balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions */}
        <AddTransactionForm />

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-700 mb-6">
            Spending by category
          </h2>
          {summaryLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={32}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    'Amount',
                  ]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.category === 'salary' ||
                        entry.category === 'freelance'
                          ? '#22c55e'
                          : '#3b82f6'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Transaction list */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Recent transactions
          </h2>
          {transactionsLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : transactions?.length === 0 ? (
            <p className="text-sm text-gray-400">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions?.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {t.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t.category} · {t.date}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
