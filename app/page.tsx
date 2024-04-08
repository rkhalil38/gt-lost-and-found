import InteractiveMap from "@/components/InteractiveMap";
import NavigationBar from "@/components/NavigationBar";
import Header from "@/components/UnivHeader";

export default async function Index() {
  const apiKey = process.env.GOOGLE_MAPS_KEY ? process.env.GOOGLE_MAPS_KEY : "";

  return (
    <div className="flex flex-col bg-mainTheme w-screen h-screen gap-20 items-center justify-center">
      <InteractiveMap apiKey={apiKey} />
    </div>
  );
}
