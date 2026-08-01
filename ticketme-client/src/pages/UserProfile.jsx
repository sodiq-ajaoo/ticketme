// import { useEffect, useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';
// import Spinner from '../components/ui/Spinner';

// function UserProfile() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   async function fetchProfile() {
//     try {
//       const res = await api.get('/users/me');

//       const user = res.data.data.user;

//       setFormData({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//       });
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       await api.patch('/users/updateMe', {
//         name: formData.name,
//         phone: formData.phone,
//       });

//       alert('Profile updated successfully.');
//     } catch (err) {
//       console.log(err);
//       alert(err.response?.data?.message || 'Unable to update profile.');
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Spinner text="Loading profile..." />
//       </div>
//     );
//   }

//   return (
//     <section className="min-h-screen bg-slate-100 py-14 dark:bg-slate-950">
//       <div className="mx-auto max-w-3xl px-6">
//         <Link
//           to="/dashboard"
//           className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline"
//         >
//           <ArrowLeft size={18} />
//           Back to Dashboard
//         </Link>

//         <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
//           <h1 className="mb-8 text-3xl font-black dark:text-white">
//             Profile Settings
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="mb-2 block font-semibold dark:text-white">
//                 Full Name
//               </label>

//               <input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
//               />
//             </div>

//             <div>
//               <label className="mb-2 block font-semibold dark:text-white">
//                 Email
//               </label>

//               <input
//                 value={formData.email}
//                 disabled
//                 className="w-full rounded-xl border bg-slate-100 p-4 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
//               />
//             </div>

//             <div>
//               <label className="mb-2 block font-semibold dark:text-white">
//                 Phone Number
//               </label>

//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
//               />
//             </div>

//             <button
//               disabled={saving}
//               className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default UserProfile;

import { useEffect, useState } from 'react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');

      const user = res.data.data.user;

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await api.patch('/users/updateMe', {
        name: formData.name,
        phone: formData.phone,
      });

      setUser(res.data.data.user);

      localStorage.setItem('user', JSON.stringify(res.data.data.user));

      // alert('Profile updated successfully.');
      // await api.patch('/users/updateMe', {
      //   name: formData.name,
      //   phone: formData.phone,
      // });

      alert('Profile updated successfully!');
    } catch (err) {
      console.log(err);
      alert('Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading profile..." />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="mb-8 text-3xl font-black dark:text-white">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-xl border bg-slate-100 p-3 text-slate-500 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UserProfile;
