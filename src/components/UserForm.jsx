import { useState } from "react";
import "./Form.css";
import { Country, State, City } from "country-state-city";

export default function UserForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: ""
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // remove error while typing
    setErrors({ ...errors, [name]: "" });
  };

  const handleCountry = (code) => {
    setForm({ ...form, country: code, state: "", city: "" });
    setStates(State.getStatesOfCountry(code));
    setCities([]);
  };

  const handleState = (code) => {
    setForm({ ...form, state: code, city: "" });
    setCities(City.getCitiesOfState(form.country, code));
  };

  // VALIDATION
  const validate = () => {
    let err = {};

    // NAME
    if (!form.name.trim()) {
      err.name = "Name is required";
    } else if (/\d/.test(form.name)) {
      err.name = "Name cannot contain numbers";
    }

    // EMAIL
    if (!form.email.trim()) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email format";
    }

    // PHONE
    if (!form.phone.trim()) {
      err.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      err.phone = "Phone must be 10 digits";
    }

    // LOCATION
    if (!form.country) err.country = "Select country";
    if (!form.state) err.state = "Select state";
    if (!form.city) err.city = "Select city";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  return (
    <div className="form-container">
      <h2>Add User</h2>

      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <p className="error">{errors.name}</p>

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <p className="error">{errors.email}</p>

        {/* PHONE */}
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <p className="error">{errors.phone}</p>

        {/* COUNTRY */}
        <select onChange={(e) => handleCountry(e.target.value)}>
          <option value="">Select Country</option>
          {Country.getAllCountries().map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="error">{errors.country}</p>

        {/* STATE */}
        <select onChange={(e) => handleState(e.target.value)}>
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
        <p className="error">{errors.state}</p>

        {/* CITY */}
        <select onChange={(e) => setForm({ ...form, city: e.target.value })}>
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        <p className="error">{errors.city}</p>

        <button className="submit-btn">Save</button>
      </form>
    </div>
  );
}