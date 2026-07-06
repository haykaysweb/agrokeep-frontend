import { useNavigate } from "react-router";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer">
      <img
        src="/Brand logo.svg"
        alt="logo"
        className="w-auto"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
