import Pagination from "@/components/Pagination";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: { userId: string; userSlug: string };
    searchParams: { page?: string; voteStatus?: "upvoted" | "downvoted" };
}) => {
    try {
        const pageNumber = parseInt(searchParams.page || "1", 10) || 1;

        const query = [
            Query.equal("votedById", params.userId),
            Query.orderDesc("$createdAt"),
            Query.offset((pageNumber - 1) * 25),
            Query.limit(25),
        ];

        if (searchParams.voteStatus) {
            query.push(Query.equal("voteStatus", searchParams.voteStatus));
        }

        // Fetch votes with error handling
        const votes = await databases.listDocuments(db, voteCollection, query).catch(() => ({
            total: 0,
            documents: [],
        }));

        // Fetch related questions/answers in parallel with proper error handling
        votes.documents = await Promise.all(
            votes.documents.map(async (vote) => {
                try {
                    if (vote.type === "question") {
                        const question = await databases.getDocument(db, questionCollection, vote.typeId, [
                            Query.select(["title"]),
                        ]);
                        return { ...vote, question };
                    }

                    // Fetch answer and its related question
                    const answer = await databases.getDocument(db, answerCollection, vote.typeId).catch(() => null);
                    if (!answer) return { ...vote, question: { title: "Unknown Question", $id: vote.typeId } };

                    const questionOfTypeAnswer = await databases.getDocument(
                        db,
                        questionCollection,
                        answer.questionId,
                        [Query.select(["title"])]
                    );

                    return { ...vote, question: questionOfTypeAnswer };
                } catch (error) {
                    console.error("Error fetching vote details:", error);
                    return { ...vote, question: { title: "Error loading question", $id: vote.typeId } };
                }
            })
        );

        return (
            <div className="px-4">
                {/* Votes Count */}
                <div className="mb-4 flex justify-between">
                    <p>{votes.total} votes</p>
                    <ul className="flex gap-1">
                        {["All", "Upvotes", "Downvotes"].map((label, index) => {
                            const value = index === 1 ? "upvoted" : index === 2 ? "downvoted" : "";
                            return (
                                <li key={label}>
                                    <Link
                                        href={`/users/${params.userId}/${params.userSlug}/votes${
                                            value ? `?voteStatus=${value}` : ""
                                        }`}
                                        className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                            searchParams.voteStatus === value ? "bg-white/20" : "hover:bg-white/20"
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Votes List */}
                <div className="mb-4 max-w-3xl space-y-6">
                    {votes.documents.length > 0 ? (
                        votes.documents.map((vote) => (
                            <div
                                key={vote.$id}
                                className="rounded-xl border border-white/40 p-4 duration-200 hover:bg-white/10"
                            >
                                <div className="flex">
                                    <p className="mr-4 shrink-0 capitalize">{vote.voteStatus}</p>
                                    {vote.question ? (
                                        <p>
                                            <Link
                                                href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                                                className="text-orange-500 hover:text-orange-600"
                                            >
                                                {vote.question.title}
                                            </Link>
                                        </p>
                                    ) : (
                                        <p className="text-gray-400">Question not found</p>
                                    )}
                                </div>
                                <p className="text-right text-sm">{convertDateToRelativeTime(new Date(vote.$createdAt))}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No votes found.</p>
                    )}
                </div>

                {/* Pagination */}
                <Pagination total={votes.total} limit={25} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching votes:", error);
        return (
            <div className="flex h-screen items-center justify-center text-xl font-semibold text-red-600">
                Failed to load votes.
            </div>
        );
    }
};

export default Page;
