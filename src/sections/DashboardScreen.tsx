{plan.limitations && plan.limitations.length > 0 && (
  <div className="mt-4 pt-4 border-t border-slate-200">
    <p className="text-sm text-slate-500 mb-2">Upgrade to unlock:</p>
    <div className="flex flex-wrap gap-2">
      {plan.limitations.map((limitation: any, index: number) => (
        <Badge key={index} variant="outline" className="text-slate-500">
          {limitation}
        </Badge>
      ))}
    </div>
  </div>
)}