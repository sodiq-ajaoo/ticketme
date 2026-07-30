import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useBooking } from '../context/BookingContext';

function Checkout() {
  const navigate = useNavigate();
  const { selectedTicket } = useBooking();

  const [quantity, setQuantity] = useState(1);

  if (!selectedTicket) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">No Ticket Selected</h1>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Back Home
        </Link>
      </div>
    );
  }

  const subtotal = selectedTicket.price * quantity;

  const serviceFee = 10;

  const tax = 5;

  const total = subtotal + serviceFee + tax;

  return (
    <section className="bg-slate-50 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Event
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="mb-8 text-4xl font-black">Checkout</h1>

          {/* Ticket */}

          <div className="flex items-center gap-4 rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
            <div className="rounded-2xl bg-blue-600 p-4 text-white">
              <Ticket size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{selectedTicket.name}</h2>

              <p className="text-slate-500">
                ${selectedTicket.price} per ticket
              </p>
            </div>
          </div>

          {/* Quantity */}

          <div className="mt-10">
            <h3 className="mb-4 text-xl font-bold">Quantity</h3>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded-xl border p-3"
              >
                <Minus size={18} />
              </button>

              <span className="text-2xl font-bold">{quantity}</span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="rounded-xl border p-3"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Summary */}

          <div className="mt-10 space-y-4 rounded-2xl bg-slate-100 p-6 dark:bg-slate-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${serviceFee}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax}</span>
            </div>

            <hr />

            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>

              <span className="text-blue-600">${total}</span>
            </div>
          </div>

          {/* <button className="mt-10 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700">
            Proceed to Payment
          </button> */}
          <button onClick={() => navigate('/payment-success')} className="...">
            Proceed to Payment
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
