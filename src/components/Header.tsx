import { useState } from "react";

import { IconTrash, IconChevronDown } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

// need to import a headless drop down
export function Header() {
  const { data: session } = useSession();

  const user = session?.user;

  // make a toggle hook

  const useDisclosure = (initial: boolean) => {
    const [opened, setOpened] = useState(initial);

    const onClose = () => {
      setOpened(false);
    };

    const toggle = () => {
      setOpened((prev) => !prev);
    };

    return { opened, onClose, toggle };
  };

  const { opened, toggle } = useDisclosure(false);

  // const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <div>
      <div>
        <section>
          <h1>
            <Link href="/" passHref>
              <a>My Blog</a>
            </Link>
          </h1>
          {/* 
          <div opened={opened} onClick={toggle} size="sm" />

          {!user && <button onClick={() => signIn()}>Login</button>} */}

          {user && (
            <section>
              <Link href="/posts/create" passHref>
                <button>Create post</button>
              </Link>
              {/* <Menu
                width={260}
                position="bottom-end"
                transition="pop-top-right"
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
              >
                <Menu.Target>
                  <button
                    className={cx(classes.user, {
                      [classes.userActive]: userMenuOpened,
                    })}
                  >
                    <section spacing={7}>
                      <Avatar
                        src={user.image}
                        alt={user.name || ""}
                        radius="xl"
                        size={20}
                      />
                      <Text
                        weight={500}
                        size="sm"
                        sx={{ lineHeight: 1 }}
                        mr={3}
                      >
                        {user.name}
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </section>
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    icon={<IconTrash size={14} stroke={1.5} />}
                    onClick={() => signOut()}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu> */}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
