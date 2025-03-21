import { databases, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";

const Page = async ({
    searchParams,
}: {
    searchParams: { page?: string; tag?: string; search?: string };
}) => {
    try {
        searchParams.page ||= "1";

        const queries = [
            Query.orderDesc("$createdAt"),
            Query.offset((+searchParams.page - 1) * 25),
            Query.limit(25),
        ];

        if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
        if (searchParams.search)
            queries.push(
                Query.or([
                    Query.search("title", searchParams.search),
                    Query.search("content", searchParams.search),
                ])
            );

        // Fetch questions
        const questions = await databases
            .listDocuments(db, questionCollection, queries)
            .catch(() => ({ total: 0, documents: [] })); // Prevents crash if API fails

        console.log("Questions:", questions);

        // Process each question
        questions.documents = await Promise.all(
            questions.documents.map(async ques => {
                const [author, answers, votes] = await Promise.all([
                    users.get<UserPrefs>(ques.authorId).catch(() => ({
                        $id: "unknown",
                        prefs: { reputation: 0 },
                        name: "Unknown User",
                    })),
                    databases
                        .listDocuments(db, answerCollection, [
                            Query.equal("questionId", ques.$id),
                            Query.limit(1),
                        ])
                        .catch(() => ({ total: 0 })),
                    databases
                        .listDocuments(db, voteCollection, [
                            Query.equal("type", "question"),
                            Query.equal("typeId", ques.$id),
                            Query.limit(1),
                        ])
                        .catch(() => ({ total: 0 })),
                ]);

                return {
                    ...ques,
                    totalAnswers: answers?.total ?? 0,
                    totalVotes: votes?.total ?? 0,
                    author: {
                        $id: author?.$id ?? "unknown",
                        reputation: author?.prefs?.reputation ?? 0,
                        name: author?.name ?? "Unknown User",
                    },
                };
            })
        );

        return (
            <div className="container mx-auto px-4 pb-20 pt-36">
                {/* Header Section */}
                <div className="mb-10 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">All Questions</h1>
                    <Link href="/questions/ask">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                    <Search />
                </div>

                {/* Questions Count */}
                <div className="mb-4">
                    <p>{questions.total} questions</p>
                </div>

                {/* Questions List */}
                <div className="mb-4 max-w-3xl space-y-6">
                    {questions.documents.length > 0 ? (
                        questions.documents.map(ques => <QuestionCard key={ques.$id} ques={ques} />)
                    ) : (
                        <p className="text-gray-500">No questions found.</p>
                    )}
                </div>

                {/* Pagination */}
                <Pagination total={questions.total} limit={25} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching questions:", error);
        return (
            <div className="flex h-screen items-center justify-center text-xl font-semibold text-red-600">
                Failed to load questions.
            </div>
        );
    }
};

export default Page;
