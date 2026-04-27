import HomeFinalCTA from "../components/HomeFinalCTA";
import HomeFooter from "../components/HomeFooter";
import HomeHero from "../components/HomeHero";
import HomeHowItWorks from "../components/HomeHowItWorks";
import HomeLenses from "../components/HomeLenses";
import HomeSignIn from "../components/HomeSignIn";
import HomeWhatYouCanBuild from "../components/HomeWhatYouCanBuild";

const HomePage = () => {
  return (
    <div className="min-h-screen text-foreground">
      <HomeSignIn />
      <main>
        <HomeHero />
        <HomeWhatYouCanBuild />
        <HomeLenses />
        <HomeHowItWorks />
        <HomeFinalCTA />
      </main>
      <HomeFooter />
    </div>
  );
};

export default HomePage;
