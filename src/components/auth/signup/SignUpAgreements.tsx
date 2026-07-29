"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SIGNUP_AGREEMENT_CONTENTS } from "@/utils/constants";

type AgreementKey = "terms" | "privacy";

interface SignUpAgreementsProps {
  //필수 약관이 모두 동의되면 true
  onChange: (allRequiredAgreed: boolean) => void;
}

const SignUpAgreements = ({ onChange }: SignUpAgreementsProps) => {
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    privacy: false,
  });
  const [openedDetail, setOpenedDetail] = useState<AgreementKey | null>(null);

  const allAgreed = agreements.terms && agreements.privacy;

  const updateAgreements = (next: Record<AgreementKey, boolean>) => {
    setAgreements(next);
    onChange(next.terms && next.privacy);
  };

  const handleAllChange = (checked: boolean) => {
    updateAgreements({ terms: checked, privacy: checked });
  };

  const handleItemChange = (key: AgreementKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAgreements({ ...agreements, [key]: e.target.checked });
  };

  const detailContent = openedDetail === "terms" ? SIGNUP_AGREEMENT_CONTENTS.TERMS : SIGNUP_AGREEMENT_CONTENTS.PRIVACY;

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-3 text-sm">
      <label className="flex items-center gap-2 font-semibold cursor-pointer">
        <input type="checkbox" checked={allAgreed} onChange={(e) => handleAllChange(e.target.checked)} />
        약관에 모두 동의합니다
      </label>
      <hr className="border-gray-200" />
      {(
        [
          ["terms", "이용약관 동의 (필수)"],
          ["privacy", "개인정보 수집·이용 동의 (필수)"],
        ] as [AgreementKey, string][]
      ).map(([key, label]) => (
        <div key={key} className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={agreements[key]} onChange={handleItemChange(key)} />
            {label}
          </label>
          <Button
            variant="plain"
            size="auto"
            className="text-gray-400"
            onClick={() => setOpenedDetail(key)}
            aria-label={`${label} 내용 보기`}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      ))}
      <Dialog open={openedDetail !== null} onOpenChange={() => setOpenedDetail(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl font-bold my-4">{detailContent.title}</DialogTitle>
            <div className="space-y-4 w-full px-5 py-4">
              {detailContent.description.map((item, index) => (
                <DialogDescription key={index} className="space-y-2 text-left">
                  <span className="font-semibold pt-2 block">{item.heading}</span>
                  {item.text.map((el, i) => (
                    <em key={i} className="pl-4 block not-italic">
                      {el}
                    </em>
                  ))}
                </DialogDescription>
              ))}
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenedDetail(null)} className="w-full">
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUpAgreements;
