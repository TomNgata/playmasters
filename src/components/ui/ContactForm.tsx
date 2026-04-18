'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simple mailto fallback — replace with API endpoint when backend is ready
    const mailto = `mailto:playmasters.bowling@gmail.com?subject=${encodeURIComponent(form.subject || 'Website Enquiry — ' + form.name)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setStatus('sent');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-navy border border-white/8 rounded-2xl p-8 flex flex-col gap-5"
    >
      <h3 className="font-wordmark text-2xl uppercase text-white mb-2">Get in Touch</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="font-ui text-xs tracking-[3px] uppercase text-gray-mid">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="bg-navy-dark/60 border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike/50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="font-ui text-xs tracking-[3px] uppercase text-gray-mid">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="bg-navy-dark/60 border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-subject" className="font-ui text-xs tracking-[3px] uppercase text-gray-mid">Enquiry Type</label>
        <select
          id="contact-subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="bg-navy-dark/60 border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-strike/50 transition-colors"
        >
          <option value="">Select a topic…</option>
          <option value="Join the Squad">Join the Squad</option>
          <option value="Sponsorship Enquiry">Sponsorship Enquiry</option>
          <option value="Media / Press">Media / Press</option>
          <option value="CSR & Partnerships">CSR &amp; Partnerships</option>
          <option value="General Enquiry">General Enquiry</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="font-ui text-xs tracking-[3px] uppercase text-gray-mid">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us more…"
          className="bg-navy-dark/60 border border-white/10 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-gray-dark focus:outline-none focus:border-strike/50 transition-colors resize-none"
        />
      </div>

      <button
        id="contact-submit"
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 bg-strike hover:bg-strike-deep text-white font-ui font-bold text-lg tracking-[4px] uppercase transition-all shadow-[0_3px_0_theme(colors.strike-deep)] active:translate-y-[1px] active:shadow-none disabled:opacity-60"
      >
        {status === 'sending' ? 'Opening Email…' : status === 'sent' ? 'Sent ✓' : 'Send Message'}
      </button>

      <p className="font-ui text-[10px] text-gray-dark tracking-widest uppercase text-center">
        Or email directly: <a href="mailto:playmasters.bowling@gmail.com" className="text-gray-mid hover:text-strike transition-colors">playmasters.bowling@gmail.com</a>
      </p>
    </form>
  );
}
