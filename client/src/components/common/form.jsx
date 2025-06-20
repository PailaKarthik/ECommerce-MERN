import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User2Icon } from "lucide-react";

const types = {
  INPUT: "input",
  SELECT: "select",
  TEXTAREA: "textarea",
};

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  ButtonText,
  mode,
  isButtonDisabled,
}) => {
  const renderInputsByComponentType = (getControlItem, mode) => {
    let element = null;
    const value = formData[getControlItem.name] || "";
    switch (getControlItem.componentType) {
      case types.INPUT:
        element = (
          <Input
            className={`${
              mode === "dark" ?
              "bg-gray-800 text-gray-400 outline-gray-800 border-gray-500 shadow-lg " : "shadow-gray-400 shadow-sm outline-none"
            } `}
            type={getControlItem.type}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            required={getControlItem.required}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
      case types.SELECT:
        element = (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [getControlItem.name]: val })
            }
          >
            <SelectTrigger
              className={`${
                mode === "dark" &&
                "bg-gray-800 text-gray-400 border-gray-500 shadow-lg"
              }`}
            >
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent
              className={`${
                mode === "dark" &&
                "bg-gray-800 text-gray-400 border-gray-500 shadow-lg"
              } cursor-pointer`}
            >
              {getControlItem.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      case types.TEXTAREA:
        element = (
          <Textarea
            className={`${
              mode === "dark" &&
              "bg-gray-800 text-gray-400 outline-gray-800 border-gray-500 shadow-lg"
            }shadow-gray-400 shadow-lg`}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            required={getControlItem.required}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
      default:
        element = null;
    }
    return element;
  };

  return (
    <form className="p-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3.5">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label
              className={` font-bold text-sm text-gray-700 ${
                mode === "dark" && "text-gray-300"
              }`}
            >
              {controlItem.label} :
            </Label>
            {renderInputsByComponentType(controlItem, mode)}
          </div>
        ))}
      </div>
      <Button
        type="submit"
        disabled={isButtonDisabled}
        className={` w-full hover:cursor-pointer bg-gray-800 mt-4 hover:bg-gray-700 ${
          mode === "dark" && "bg-gray-900 "
        }`}
      >
        {ButtonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
