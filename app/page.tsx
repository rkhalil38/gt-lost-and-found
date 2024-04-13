import InteractiveMap from "@/components/InteractiveMap";
import NavigationBar from "@/components/NavigationBar";
import Header from "@/components/UnivHeader";

export default async function Index() {
  const apiKey = process.env.GOOGLE_MAPS_KEY ? process.env.GOOGLE_MAPS_KEY : "";

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-20 bg-mainTheme">
      <InteractiveMap apiKey={apiKey} />
    </div>
  );
}
