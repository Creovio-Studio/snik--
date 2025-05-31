import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import React from "react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];
  return (
    <div className=" flex flex-col pt-2">
      {isPending ? (
        <Loader className=" w-8 h-8 animate-spin place-self-center flex"></Loader>
      ) : null}

      <ul role="list" className=" space-y-3">
        {members.map((member, index) => {
          const name = member.user.name || " ";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              role="listitem"
              className=" flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              key={index}
            >
              <div className=" flex-shrink-0">
                <Avatar>
                  <AvatarImage
                    alt="Avatar"
                    src={member.user.profile_picture || ""}
                  />

                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>

                  <div className=" flex flex-col">
                    <p className=" text-sm font-medium text-gray-900">
                      {member.user.name}
                    </p>
                    <p className="text-sm text-gray-500">{member.role.name}</p>

                    <div className=" ml-auto text-sm text-gray-500">
                      <p>Joined</p>
                      <p>
                        {member.joined_at
                          ? format(member.joined_at, "PPP")
                          : null}
                      </p>
                    </div>
                  </div>
                </Avatar>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentMembers;
