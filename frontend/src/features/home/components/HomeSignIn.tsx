import { Link } from "react-router-dom";
import { SIGNIN_PATH } from "../model/homeContent";

const HomeSignIn = () => {
  return (
    <Link
      to={SIGNIN_PATH}
      className="fixed right-6 top-6 z-30 rounded-full border border-primary-light/35 bg-background/40 px-5 py-2 font-display text-xs uppercase tracking-[0.3em] text-primary-light/85 backdrop-blur transition-all hover:border-primary-light/60 hover:text-primary-light hover:shadow-[0_0_18px_hsl(var(--primary-light)/0.25)]"
    >
      Sign in
    </Link>
  );
};

export default HomeSignIn;
