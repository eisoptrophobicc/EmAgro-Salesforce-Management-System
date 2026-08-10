from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions.auth import (
    ForbiddenError,
    InvalidCredentialsError,
    UnauthorizedError,
)
from app.exceptions.base import AppException
from app.exceptions.user import (
    AttendanceAlreadyMarkedError,
    AttendanceNotFoundError,
    DailyActivityAlreadyExistsError,
    DailyActivityNotFoundError,
    EmailAlreadyExistsError,
    EmployeeAlreadyExistsError,
    EmployeeNotFoundError,
    RoleNotFoundError,
    TaskAlreadyExistsError,
    TaskNotFoundError,
    UserNotFoundError,
)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(EmailAlreadyExistsError)
    async def email_exists_handler(
        request: Request,
        exc: EmailAlreadyExistsError,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(RoleNotFoundError)
    async def role_not_found_handler(
        request: Request,
        exc: RoleNotFoundError,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsError,
    ):
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(UnauthorizedError)
    async def unauthorized_handler(
        request: Request,
        exc: UnauthorizedError,
    ):
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(ForbiddenError)
    async def forbidden_handler(
        request: Request,
        exc: ForbiddenError,
    ):
        return JSONResponse(
            status_code=403,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request,
        exc: AppException,
    ):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(UserNotFoundError)
    async def user_not_found_handler(
        request: Request,
        exc: UserNotFoundError,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": exc.message,
            },
        )

    @app.exception_handler(EmployeeAlreadyExistsError)
    async def employee_already_exists_handler(
        request: Request,
        exc: EmployeeAlreadyExistsError,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(EmployeeNotFoundError)
    async def employee_not_found_handler(
        request: Request,
        exc: EmployeeNotFoundError,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(AttendanceAlreadyMarkedError)
    async def attendance_already_marked_handler(
        request: Request,
        exc: AttendanceAlreadyMarkedError,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(AttendanceNotFoundError)
    async def attendance_not_found_handler(
        request: Request,
        exc: AttendanceNotFoundError,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(TaskAlreadyExistsError)
    async def task_already_exists_handler(
        request: Request,
        exc: TaskAlreadyExistsError,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(TaskNotFoundError)
    async def task_not_found_handler(
        request: Request,
        exc: TaskNotFoundError,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(DailyActivityAlreadyExistsError)
    async def daily_activity_already_exists_handler(
        request: Request,
        exc: DailyActivityAlreadyExistsError,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(DailyActivityNotFoundError)
    async def daily_activity_not_found_handler(
        request: Request,
        exc: DailyActivityNotFoundError,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": str(exc),
            },
        )
