import { useEffect, useState } from "react";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

export default function CustomerService() {
  const [list, setList] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [attachmentMessage, setAttachmentMessage] = useState("");
  const [notices, setNotices] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const load = () => api.customerService.list().then((v) => {
    const rows = v || [];
    setList(rows);
    if (rows.length && !selectedInquiryId) setSelectedInquiryId(rows[0].id);
  });

  useEffect(() => {
    load();
    api.support.notices().then((v) => setNotices(v || []));
    api.support.faqs().then((v) => setFaqs(v || []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.customerService.create({ subject, content });
    setSubject("");
    setContent("");
    load();
  };

  const uploadAttachment = async (file) => {
    if (!file || !selectedInquiryId) return;
    const result = await api.support.uploadInquiryAttachment(selectedInquiryId, file);
    setAttachmentMessage(result?.message || "Uploaded");
  };

  return (
    <PageLayout title="Customer Center" description="1:1 inquiries, notices, FAQ, and attachment simulation.">
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="bg-card border rounded-xl p-4">
          <h2 className="font-bold mb-3">Create Inquiry</h2>
          <form onSubmit={submit} className="space-y-2">
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
            <button className="bg-primary text-white rounded-lg px-4 py-2">Submit</button>
          </form>

          <div className="mt-4 space-y-2">
            {list.map((v) => (
              <label key={v.id} className="block border rounded p-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  className="mr-2"
                  checked={selectedInquiryId === v.id}
                  onChange={() => setSelectedInquiryId(v.id)}
                />
                <span className="font-semibold">{v.subject}</span>
                <span className="ml-2 text-muted-foreground">{v.status}</span>
                {v.adminAnswer && <p className="text-xs mt-1">Answer: {v.adminAnswer}</p>}
              </label>
            ))}
          </div>

          <div className="mt-3">
            <label className="text-sm font-semibold">Attachment (learning mode)</label>
            <input type="file" className="block mt-1" onChange={(e) => uploadAttachment(e.target.files?.[0] || null)} />
            {attachmentMessage && <p className="text-xs text-muted-foreground mt-1">{attachmentMessage}</p>}
          </div>
        </section>

        <section className="space-y-4">
          <div className="bg-card border rounded-xl p-4">
            <h2 className="font-bold mb-2">Notices</h2>
            <div className="space-y-2">
              {notices.map((n) => (
                <div key={n.id} className="border rounded p-2 text-sm">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <h2 className="font-bold mb-2">FAQ</h2>
            <div className="space-y-2">
              {faqs.map((f) => (
                <div key={f.id} className="border rounded p-2 text-sm">
                  <p className="font-semibold">[{f.category}] {f.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
