import { Code, Heading, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";

import { useColorModeValue } from "../components/ui/color-mode";

export function About() {
  return (
    <Stack
      boxShadow="2xl"
      bg={useColorModeValue("white", "gray.800")}
      rounded="xl"
      p={10}
      gap={4}
      align="left"
      minWidth={950}
    >
      <Heading size="md">About</Heading>
      <Text>
        ZAUP 2 is a{" "}
        <Link color="blue.400" href="https://en.wikipedia.org/wiki/Time-based_one-time_password">
          TOTP <FiExternalLink />
        </Link>{" "}
        authenticator app for the web: It acts much like{" "}
        <Link
          color="blue.400"
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
        >
          Google Authenticator <FiExternalLink />
        </Link>{" "}
        but stores TOTP secrets in your browser&apos;s local storage, and thus they never leave your machine. Data in
        storage is encrypted using AES using a master password.
      </Text>

      <VStack gap={0} align="left">
        <Text>
          <Link color="blue.400" href="https://github.com/rm-hull/zaup2">
            https://github.com/rm-hull/zaup2 <FiExternalLink />
          </Link>
        </Text>
        <Text>
          Build info: <Code>{import.meta.env.VITE_GIT_COMMIT_HASH}</Code>, {import.meta.env.VITE_GIT_COMMIT_DATE}
        </Text>

        <Text>
          Google API client ID: <Code>{import.meta.env.VITE_GOOGLE_API_CLIENT_ID}</Code>
        </Text>
      </VStack>

      <Heading size="md">MIT License</Heading>
      <Text>Copyright &copy; {new Date().getFullYear()} Richard Hull</Text>

      <Text>
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
        documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without
        limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
        Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      </Text>

      <Text>
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of
        the Software.
      </Text>

      <Text>
        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
        LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
        SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
        OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </Text>
    </Stack>
  );
}
