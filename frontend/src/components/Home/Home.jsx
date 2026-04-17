import React from "react";
import HeroSection from "./HeroSection";
import { Helmet } from "react-helmet-async";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>HHN | India's Neighborhood Opportunity Hub</title>
        <meta name="description" content="Discover local talent and job opportunities within a 10km radius." />
      </Helmet>
      <section className="homePage page">
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;
