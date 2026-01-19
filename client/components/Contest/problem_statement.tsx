"use client";
import { contestProblem } from "@/types/types";
import axios from "axios";
import { useParams } from "next/navigation";
import * as React from "react";
import { useState, useEffect } from "react";
interface IProblem_statementProps {
  shownProblem: contestProblem | null;
}

const Problem_statement: React.FunctionComponent<IProblem_statementProps> = ({
  shownProblem,
}) => {
  const [description, setDescription] = useState("");
  const { id } = useParams();
  useEffect(() => {
    if (shownProblem) {
      const getDescription = async () => {
        await axios
          .get(`/api/problems/${shownProblem.id}/description`)
          .then((res) => {
            setDescription(res.data.description);
          })
          .catch(() => {
            setDescription("Error fetching description");
          });
      };
      getDescription();
    }
  }, [shownProblem]);

  return (
    <div className="">
      <p className="text-text text-sm">{description}</p>
    </div>
  );
};

export default Problem_statement;
