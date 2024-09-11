import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Import Button component from ShadCN

const VerificationSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Email Verified Successfully!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your email has been verified. You can now proceed to use your account.
        </p>
        <Link to="/auth/login">
          <Button variant="default" className="px-6 py-3">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VerificationSuccess;
