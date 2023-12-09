import { Heading, Link, Stack, Text, Code, Box } from "@chakra-ui/react";

export default function About(): JSX.Element | null {
  return (
    <Stack boxShadow="2xl" rounded="xl" p={10} spacing={4} align="left" minWidth={950}>
      <Heading size="md">About</Heading>
      <Text>
        ZAUP 2 is a{" "}
        <Link isExternal color="blue.400" href="https://en.wikipedia.org/wiki/Time-based_one-time_password">
          TOTP
        </Link>{" "}
        authenticator app for the web: It acts much like{" "}
        <Link
          isExternal
          color="blue.400"
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
        >
          Google Authenticator
        </Link>{" "}
        but stores TOTP secrets in your browser&apos;s local storage, and thus they never leave your machine. Data in
        storage is encrypted using AES using a master password.
      </Text>

      <Text>
        <Link isExternal color="blue.400" href="https://github.com/rm-hull/zaup2">
          https://github.com/rm-hull/zaup2
        </Link>

        <Box>
          Build info: <Code>{import.meta.env.VITE_GIT_COMMIT_HASH}</Code>, {import.meta.env.VITE_GIT_COMMIT_DATE}
        </Box>
      </Text>

      <Heading size="md">MIT License</Heading>
      <Text>Copyright (c) 2021 Richard Hull</Text>

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
