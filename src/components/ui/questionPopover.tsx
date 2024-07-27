import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import HelpInstructions from "./instructions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

export function QuestionPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" className="border-purple-500 ml-auto">
          <FontAwesomeIcon icon={faCircleQuestion} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <HelpInstructions />
      </PopoverContent>
    </Popover>
  );
}
