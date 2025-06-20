import React, { Fragment } from "react";
import { filterOptions } from "@/config";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

const DisplayFilterOptions = ({ filters, handleFilter }) => {
  return (
    <div className="p-4 lg:space-y-4 flex lg:flex-col space-x-4">
      {Object.entries(filterOptions).map(([sectionType, options], idx) => (
        <Fragment key={sectionType}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h3 className="text-sm font-bold capitalize">{sectionType}</h3>
            <div className="grid gap-2 mt-2">
              {options.map((option) => {
                const isChecked = Boolean(filters[sectionType]?.includes(option.id));
                return (
                  <Label key={option.id} className="flex items-center">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleFilter(sectionType, option.id)}
                    />
                    <span className="ml-2 font-medium text-gray-200">
                      {option.label}
                    </span>
                  </Label>
                );
              })}
            </div>
          </motion.div>
          {idx < Object.keys(filterOptions).length - 1 && (
            <Separator className="bg-gray-600 hidden lg:block my-4" />
          )}
        </Fragment>
      ))}
    </div>
  );
};


const ProductFilter = ({ filters, handleFilter }) => {
  return (
    <div className="bg-gray-800 rounded-sm shadow-sm text-gray-100">
      <Accordion className="block lg:hidden" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 cursor-pointer py-3 border-b border-gray-500">
            <h2 className="text-lg font-bold">Filters</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 ">
              <DisplayFilterOptions
                filters={filters}
                handleFilter={handleFilter}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="hidden lg:block">
        <div className="p-4 border-b border-gray-500">
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        <DisplayFilterOptions filters={filters} handleFilter={handleFilter} />
      </div>
    </div>
  );
};

export default ProductFilter;
