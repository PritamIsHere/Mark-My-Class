import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-orange-100 rounded-full">
              <AlertTriangle size={64} className="text-orange-500" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold text-gray-800">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>

          {/* Action */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-md transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
