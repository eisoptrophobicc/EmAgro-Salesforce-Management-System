from app.models import DailyActivity, DailyActivityItem
from app.schemas.daily_activity import DailyActivityItemResponse, DailyActivityResponse


class DailyActivityMapper:

    @staticmethod
    def to_item_response(
        item: DailyActivityItem,
    ) -> DailyActivityItemResponse:
        return DailyActivityItemResponse.model_validate(item)

    @staticmethod
    def to_response(
        activity: DailyActivity,
    ) -> DailyActivityResponse:
        return DailyActivityResponse.model_validate(activity)
