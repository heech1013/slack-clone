import React from "react";
import {
  Header,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceName,
  Chats,
  MenuScroll,
  RightMenu,
  ProfileImg,
  WorkspaceButton,
  AddButton,
} from "@layouts/Workspace/styles";
import useSWR from "swr";
import gravatar from "gravatar";
import { Link, Route, Switch } from "react-router-dom";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router-dom";
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";
import DirectMessage from "@pages/DirectMessage";

function Workspace() {
  const { data: userData } = useSWR<IUser>("/api/users", fetcher);
  const { workspace } = useParams();

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg
                src={gravatar.url(userData.email, { s: "36px", d: "retro" })}
              ></ProfileImg>
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}`}>
                <WorkspaceButton>
                  {ws.name.slice(0, 1).toUpperCase()}
                </WorkspaceButton>
              </Link>
            );
          })}
          <AddButton>+</AddButton>
        </Workspaces>

        <Channels>
          <WorkspaceName>
            {userData?.Workspaces.find((v) => v.url === workspace)?.name}
          </WorkspaceName>
          <MenuScroll>
            <ChannelList></ChannelList>
            <DMList />
          </MenuScroll>
        </Channels>

        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:chennel" />
            <Route path="/workspace/:workspace/dm/:id">
              <DirectMessage />
            </Route>
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
}

export default Workspace;
