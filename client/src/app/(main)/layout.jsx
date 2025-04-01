import { Header, Navbar } from "@/components";
import { CameraProvider } from "@/context/camera.context";

const layout = ({ children }) => {
  return (
    <CameraProvider>
      <main className="flex flex-col h-svh gap-[1rem] px-[1rem]">
        <Header />
        <div className="max-container flex-1 overflow-auto bg-primary">
          {children}
        </div>
        <Navbar />
      </main>
    </CameraProvider>
  );
};

export default layout;
