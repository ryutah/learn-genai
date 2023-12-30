"use client";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SearchBar from "./_components/SearchBar";

interface SearchResultProps {
  title: string;
  description: string;
  href?: string;
}

function LLMSummary() {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        padding: 3,
        backgroundColor: (theme) => theme.palette.primary.light,
        color: (theme) => theme.palette.primary.contrastText,
      }}
    >
      <Typography variant="body2">
        LLM による回答結果をここに書いたりするんじゃない
      </Typography>
    </Paper>
  );
}

function SearchResult(props: SearchResultProps): JSX.Element {
  return (
    <Card
      sx={{
        height: "10rem",
      }}
    >
      <CardContent
        sx={{
          height: "7rem",
        }}
      >
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2">{props.description}</Typography>
      </CardContent>
      <CardActions>
        <Link href={props.href} underline="none">
          show documents
        </Link>
      </CardActions>
    </Card>
  );
}

function SearchResultList(): JSX.Element {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        padding: 3,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">Search Results</Typography>
        <SearchResult
          title="How to use the search bar?"
          description="You can type in the search bar and press enter to search for documents."
          href="#"
        />
        <SearchResult
          title="How to use the search bar?"
          description="You can type in the search bar and press enter to search for documents."
          href="#"
        />
      </Stack>
    </Paper>
  );
}

export default function Home() {
  return (
    <Box>
      <Stack spacing={5}>
        <Typography variant="h4" component="h1">
          Search Example
        </Typography>
        <SearchBar autoFocus={true} />
        <LLMSummary />
        <SearchResultList />
      </Stack>
    </Box>
  );
}
