import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Web Developer",
  "Full Stack Developer",
  "Graphic Designer",
];

const CategoryCarousel = () => {
  return (
    <div className="relative px-4">
      <Carousel className="w-full max-w-4xl mx-auto my-10">
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center"
            >
              <Button
                variant="outline"
                className="rounded-full text-sm sm:text-base px-4 py-2 whitespace-nowrap"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 sm:-left-5 top-1/2 transform -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2" />
        <CarouselNext className="right-0 sm:-right-5 top-1/2 transform -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
