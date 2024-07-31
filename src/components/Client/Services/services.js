import React from "react";
import icon from "../../../assets/images/services-icon.svg";
const Data = [
  {
    name: "Kickstarter",
    price: "$6,999.00 AUD per month + GST",
    plan: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    details: [
      "1 Content Creator",
      "8 Video Ads (4 Concepts x 2 Hook Variations)",
      "1 Static Graphic Ad",
      "1 Animated Graphic Ad (GIF)",
      "Creative Research & Strategy",
      "Direct Response Copywriting",
      "Optimized for Placement & Performance",
      "Subtitles & Royalty-Free Music",
      "1 Revision After Delivery",
    ],
  },
  {
    name: "Growth",
    price: "$6,999.00 AUD per month + GST",
    plan: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    details: [
      "1 Content Creator",
      "8 Video Ads (4 Concepts x 2 Hook Variations)",
      "1 Static Graphic Ad",
      "1 Animated Graphic Ad (GIF)",
      "Creative Research & Strategy",
      "Direct Response Copywriting",
      "Optimized for Placement & Performance",
      "Subtitles & Royalty-Free Music",
      "1 Revision After Delivery",
      "Optimized for Placement & Performance",
      "Subtitles & Royalty-Free Music",
      "1 Revision After Delivery",
    ],
  },
  {
    name: "Premium",
    price: "$6,999.00 AUD per month + GST",
    plan: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    details: [
      "1 Content Creator",
      "8 Video Ads (4 Concepts x 2 Hook Variations)",
      "1 Static Graphic Ad",
      "1 Animated Graphic Ad (GIF)",
      "Creative Research & Strategy",
      "Direct Response Copywriting",
      "Optimized for Placement & Performance",
      "Subtitles & Royalty-Free Music",
      "1 Revision After Delivery",
    ],
  },
];

const Card = ({ name, plan, details, price }) => (
  <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/3 p-1">
    <div className="services-title">
      <img src={icon} alt="icon" className="w-7 me-2" />
      {name}
    </div>
    <div className="services-card">
      <div className="p-4">
        <div className="text-gray-600 mb-2 italic">{price}</div>
        <h2 className="font-bold mb-1">{name} Plan</h2>
        <div className="text-gray-700 mb-2">{plan}</div>
        <h2 className="font-bold mb-1">What's Included</h2>
        <ul className="ml-1 text-xs">
          {details.map((detail, index) => (
            <li key={index} className="flex">
              <svg
                className="flex-shrink-0 w-3 h-3 text-black me-1 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const CardGrid = () => (
  <div className="flex flex-wrap -mx-4">
    {Data.map((item, index) => (
      <Card
        key={index}
        name={item.name}
        plan={item.plan}
        details={item.details}
        price={item.price}
      />
    ))}
  </div>
);

function Services() {
  return (
    <div>
      <div className="p-8 sm:ml-64 mt-12">
        <div className="services-heading mb-2">Services</div>
        <CardGrid />
      </div>
    </div>
  );
}

export default Services;
