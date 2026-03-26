import Hero from "@/components/sections/Hero";
import NavBar from "../components/sections/NavBar";
import FeaturedTutors from "@/components/sections/FeaturedTutor";
import PLACEHOLDER_TUTORS from "@/assets/placeholderData";
import HowItWorks from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <>
      <NavBar></NavBar>
      <Hero></Hero>
      <FeaturedTutors tutors={PLACEHOLDER_TUTORS}></FeaturedTutors>
      <HowItWorks></HowItWorks>
    </>
  );
}
