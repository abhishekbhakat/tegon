import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';
import { AssigneeLine } from '@tegonhq/ui/icons';

import type { User } from 'common/types';

import { useScope } from 'hooks';

import { DropdownItem } from '../dropdown-item';

interface IssueAssigneeDropdownContentProps {
  onChange?: (assigneeId: string | string[]) => void;
  usersData: User[];
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export function IssueAssigneeDropdownContent({
  onChange,
  usersData,
  onClose,
  multiple = false,
  value,
}: IssueAssigneeDropdownContentProps) {
  useScope('command');

  function getUserData(userId: string) {
    return usersData.find((userData: User) => userData.id === userId);
  }

  const onValueChange = (checked: boolean, id: string) => {
    if (checked && !value.includes(id)) {
      onChange && onChange([...value, id]);
    }

    if (!checked && value.includes(id)) {
      const newIds = [...value];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

  return (
    <CommandGroup>
      <DropdownItem
        id="no-user"
        value="No Assignee"
        index={0}
        onSelect={() => {
          if (!multiple) {
            onChange && onChange(null);
            onClose();
          }
        }}
      >
        <div className="flex gap-2 items-center">
          {multiple && (
            <Checkbox
              id="no-user"
              checked={value.includes('no-user')}
              onCheckedChange={(value: boolean) =>
                onValueChange(value, 'no-user')
              }
            />
          )}
          <div className="flex grow">
            <AssigneeLine size={20} className="mr-2" />
            No Assignee
          </div>
        </div>
      </DropdownItem>
      {usersData &&
        usersData.map((user: User, index: number) => {
          const userData = getUserData(user.id);

          return (
            <DropdownItem
              key={user.id}
              id={user.id}
              value={user.fullname}
              index={index + 1}
              onSelect={(currentValue: string) => {
                if (!multiple) {
                  onChange && onChange(currentValue);
                  onClose();
                }
              }}
            >
              <div className="flex gap-2 items-center">
                {multiple && (
                  <Checkbox
                    id={userData.fullname}
                    checked={value.includes(user.id)}
                    onCheckedChange={(value: boolean) => {
                      onValueChange(value, user.id);
                    }}
                  />
                )}
                <label htmlFor={user.fullname} className="flex gap-2 grow">
                  <AvatarText
                    text={user.fullname}
                    className="h-5 w-5 text-[9px]"
                  />

                  {userData.fullname}
                </label>
              </div>
            </DropdownItem>
          );
        })}
    </CommandGroup>
  );
}
