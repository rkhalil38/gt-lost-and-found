import UnivHeader from "@/components/UnivHeader";

const NotFound = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-mainTheme">
      <h1 className="bg-gradient-to-b from-gtGold to-white bg-clip-text text-3xl font-semibold text-transparent">
        GT Lost and Found
      </h1>
      <h1 className="text-3xl">
        404 - Item Already Claimed or Page Does Not Exist
      </h1>
    </div>
  );
};

export default NotFound;
