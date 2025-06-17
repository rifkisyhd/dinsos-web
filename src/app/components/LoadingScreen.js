import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading.json";

export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-100">
                <Lottie animationData={loadingAnimation} loop={true} />
            </div>
        </div>
    );
}
