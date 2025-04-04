import { Header, Navbar } from "@/components";
import { CameraProvider } from "@/context/CameraContext";
import Protected from "@/hoc/Protected";

const layout = ({ children }) => {
  return (
    <Protected>
      <main className="flex flex-col h-svh px-[1rem] bg-primary">
        <Header />
        <div className="max-container flex-1 overflow-auto bg-primary">
          {children}
        </div>
        <Navbar />
      </main>
    </Protected>
  );
};

export default layout
