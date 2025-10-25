import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar, AvatarIcon } from "@nextui-org/avatar";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PlayerModal from "./PlayerModal";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function UserInfoBtn() {
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userData, loading } = useAuth();

  // Check if user needs to set up a player
  React.useEffect(() => {
    if (user && userData && !userData.player) {
      setIsPlayerModalOpen(true);
    }
  }, [user, userData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handlePlayerSubmit = async (player) => {
    if (user) {
      try {
        await setDoc(doc(db, "Users", user.uid), { player }, { merge: true });
        console.log(`Player ${player} saved in user data`);
      } catch (error) {
        console.error("Error saving player:", error);
      }
    }
    setIsPlayerModalOpen(false);
  };

  // Don't render anything if loading or no user
  if (loading) return null;
  if (!user) return null;

  return (
    <div className="flex items-center">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            icon={<AvatarIcon />}
            src={user.photoURL || undefined}
            classNames={{
              base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
              icon: "text-black/80",
            }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="profile"
            className="h-14 gap-2"
            textValue="User profile information"
          >
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">
              {user.displayName || user.email || "User"}
            </p>
          </DropdownItem>
          <DropdownItem
            key="settings"
            onClick={() => setIsSettingsModalOpen(true)}
            textValue="My settings"
          >
            My Settings
          </DropdownItem>
          <DropdownItem
            isDisabled
            key="list"
            textValue="My list is currently unavailable"
          >
            My List
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onClick={handleLogout}
            textValue="Log out of the account"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Player Modal */}
      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        onSubmit={handlePlayerSubmit}
      />

      {/* Settings Modal */}
      <PlayerModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSubmit={handlePlayerSubmit}
        // userData={userData}
      />
    </div>
  );
}
