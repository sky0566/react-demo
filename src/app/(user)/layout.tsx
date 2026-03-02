import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import EscalatorFloat from '@/components/EscalatorFloat';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">{children}</main>
      <Footer />
      <WhatsAppButton />
      <EscalatorFloat />
    </>
  );
}
