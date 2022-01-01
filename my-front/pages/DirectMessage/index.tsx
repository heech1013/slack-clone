import React, { useCallback } from "react";
import { Header } from "@pages/DirectMessage/styles";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import gravatar from "gravatar";
import useSWR, { useSWRInfinite } from "swr";
import fetcher from "@utils/fetcher";
import { IDM, IUser } from "@typings/db";
import { useParams } from "react-router-dom";
import useInput from "@hooks/useInput";
import axios from "axios";

function DirectMessage() {
  const { workspace, id } = useParams();
  const { data: myData } = useSWR<IUser>("/api/user", fetcher);
  const { data: userData } = useSWR<IUser>(
    `/api/workspace/${workspace}/user/${id}`,
    fetcher
  );
  const [chat, onChangeChat, setChat] = useInput("");
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${
        index + 1
      }`,
    fetcher
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault;

      if (myData && userData && chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }).then(() => {
          setChat("");
        });
      }

      axios
        .post(
          `api/workspace/${workspace}/dm/${id}/chat`,
          {
            content: chat,
          },
          {
            withCredentials: true,
          }
        )
        .catch(console.error);
    },
    [chat, chatData, myData, userData, workspace, id]
  );

  return (
    <div>
      <Header>
        {userData && (
          <>
            <img
              src={gravatar.url(userData.email, { s: "24px", d: "retro" })}
              alt={userData.nickname}
            />
            <span>{userData.nickname}</span>
          </>
        )}
      </Header>
      <ChatList />
      {userData && (
        <ChatBox
          placeholder={`Message ${userData.nickname}`}
          data={[]}
          onChangeChat={onChangeChat}
          onSubmitForm={onSubmitForm}
          chat={chat}
        />
      )}
    </div>
  );
}

export default DirectMessage;
