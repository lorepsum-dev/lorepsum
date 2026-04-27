import { Link } from "react-router-dom";
import { SIGNIN_PATH } from "../model/homeContent";

const HomeSignIn = () => {
  return (
    <Link
      to={SIGNIN_PATH}
      className="fixed right-6 top-6 z-30 rounded-full border border-primary-light/20 bg-background/40 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-primary-light/70 backdrop-blur transition-colors hover:border-primary-light/40 hover:text-primary-light"
    >
      Sign in
    </Link>
  );
};

export default HomeSignIn;
