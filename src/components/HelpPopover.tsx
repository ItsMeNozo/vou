import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import HelpInstructions from "./instructions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

export function QuestionPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <FontAwesomeIcon
          icon={faCircleQuestion}
          className=" hover:text-purple-700 transition-colors duration-300 text-xl"
        />
      </PopoverTrigger>
      <PopoverContent className="mt-5">
        <HelpInstructions />
      </PopoverContent>
    </Popover>
  );
}
